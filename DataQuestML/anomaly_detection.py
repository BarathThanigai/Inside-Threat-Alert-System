from pymongo import MongoClient
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder

# --- Load dataset ---
filename = 'insider_threat_logs.xlsx'
df = pd.read_excel(filename, engine='openpyxl')

# --- Preprocessing ---
df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek

feature_cols = ['user_id', 'action', 'hour', 'day_of_week',
                'file_size', 'application', 'command',
                'privilege_level', 'overtime_approved', 'file_approved']
data = df[feature_cols].copy()

for col in data.select_dtypes(include=['object']).columns:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col].astype(str))

data = data.fillna(0)

# --- Isolation Forest ---
iso = IsolationForest(contamination=0.05, random_state=42)
df['anomaly_raw'] = iso.fit_predict(data)
df['anomaly_score'] = iso.decision_function(data)
df['anomaly'] = df['anomaly_raw'].map({1: "Normal", -1: "Suspicious"})

# --- Rule-based classification ---
def classify_event_by_final_rules(row):
    hour = pd.to_datetime(row['timestamp']).hour
    dangerous_commands = ['chmod 777 /var/log', 'rm -rf /tmp/*']
    if row.get('command') in dangerous_commands:
        return "Suspicious (Dangerous Command)"
    if row.get('file_size', 0) > 350 and row.get('file_approved', 0) == 0:
        return "Suspicious (Large File Size - Unapproved)"
    is_overtime = (hour < 9 or hour > 18)
    high_privilege = (row.get('privilege_level') in ['admin', 'superuser'])
    if is_overtime and high_privilege and row.get('overtime_approved') == 0:
        return "Suspicious (Unapproved Overtime)"
    sensitive_files = ['salary_data.xlsx', 'confidential.pdf']
    is_newly_promoted = row.get('days_worked', 999) < 30
    if row.get('file_name') in sensitive_files and row.get('user_branch') != 'HR' and not is_newly_promoted:
        return "Suspicious (Sensitive File Access)"
    if row.get('user_branch') != row.get('resource_branch') and row.get('privilege_level') != 'admin':
        return "Suspicious (Branch Crossover)"
    return "Normal"

df['final_classification'] = df.apply(classify_event_by_final_rules, axis=1)

# --- MongoDB integration ---
client = MongoClient("mongodb+srv://baratht2024_db_user:barath@insidethreatdetection.gm7hkey.mongodb.net/insidethreatdetection?retryWrites=true&w=majority&appName=InsideThreatDetection")
db = client['insidethreatdetection']
collection = db['anomaly_logs']

# Insert only suspicious events
suspicious_df = df[df['final_classification'] != 'Normal']
records = suspicious_df.to_dict(orient='records')
collection.insert_many(records)
print(f"Inserted {len(records)} suspicious records into MongoDB!")

