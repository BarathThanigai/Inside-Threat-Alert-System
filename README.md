# Insider Threat Detection Dashboard  

This project implements a system for detecting and visualizing insider threats using machine learning and user activity logs. Log data is ingested from Excel, processed with an **Isolation Forest** model to identify anomalies, stored in **MongoDB**, and served through a **Node.js + Express backend**. The **React frontend** provides a real-time dashboard to view both logs and detected anomalies.  

## Tech Stack  
- **Frontend**: React, CSS  
- **Backend**: Node.js, Express  
- **Database**: MongoDB  
- **Machine Learning**: Isolation Forest (Python, scikit-learn)  

## Features  
- Log ingestion from Excel and storage in MongoDB  
- Anomaly detection using Isolation Forest  
- REST APIs for logs and alerts (`/api/logs`, `/api/alerts`)  
- Interactive dashboard to view activity logs and anomalies  
- Auto-refresh with scrollable log and alert sections  
