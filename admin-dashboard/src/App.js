import React from 'react';
import './App.css';
import Notifications from './components/Notifications';
import StockTable from './components/StockTable';
import OrderManagement from './components/OrderManagement';
import AuditLogs from './components/AuditLogs';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Admin Dashboard</h1>
            </header>
            <main className="dashboard">
                <section className="dashboard-section">
                    <Notifications />
                </section>
                <section className="dashboard-section">
                    <StockTable />
                </section>
                <section className="dashboard-section full-width">
                    <OrderManagement />
                </section>
                <section className="dashboard-section full-width">
                    <AuditLogs />
                </section>
            </main>
        </div>
    );
}

export default App;
