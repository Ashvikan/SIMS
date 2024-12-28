import React, { useState, useEffect } from "react";
import axios from "axios";

function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/notifications");
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Polling every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.length > 0 ? (
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>
                            <strong>Product ID:</strong> {notification.productId} - {notification.message}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notifications at the moment.</p>
            )}
        </div>
    );
}

export default Notifications;
