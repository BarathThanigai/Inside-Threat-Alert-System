import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true); // only for first load
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      if (logs.length === 0 && alerts.length === 0) {
        setLoading(true); // only block screen on first load
      }

      const logsRes = await fetch("http://localhost:5000/api/logs");
      const logsData = await logsRes.json();

      const alertsRes = await fetch("http://localhost:5000/api/alerts");
      const alertsData = await alertsRes.json();

      setLogs(logsData);
      setAlerts(alertsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // every 5 min
    return () => clearInterval(interval);
  }, []);

  // Helper to clean keys
  const filterKeys = (obj) =>
    Object.keys(obj).filter((k) => k !== "_id" && k !== "__v");

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Insider Threat Detection Dashboard</h1>
        {lastUpdated && (
          <p className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </header>

      {loading ? (
        <p className="loading">Loading data...</p>
      ) : (
        <div className="content">
          {/* Logs Section */}
          <section>
            <h2>User Activity Logs</h2>
            <div className="table-container">
              <table className="table userlogs">
                <thead>
                  <tr>
                    {logs.length > 0 &&
                      filterKeys(logs[0]).map((key, idx) => (
                        <th key={idx}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => (
                    <tr key={idx}>
                      {filterKeys(log).map((key, i) => (
                        <td key={i}>{String(log[key])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Alerts Section */}
          <section>
            <h2>Detected Anomalies</h2>
            <div className="table-container">
              <table className="table anomaly">
                <thead>
                  <tr>
                    {alerts.length > 0 &&
                      filterKeys(alerts[0]).map((key, idx) => (
                        <th key={idx}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, idx) => (
                    <tr
                      key={idx}
                      className={`alert-${alert.alert_level?.toLowerCase() || "low"}`}
                    >
                      {filterKeys(alert).map((key, i) => (
                        <td key={i}>{String(alert[key])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
