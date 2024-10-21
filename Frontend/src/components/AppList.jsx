import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const AppList = () => {
  const { workspaceId } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/apps/workspace/${workspaceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setApps(data.apps);
          setLoading(false);
        } else {
          const errorData = await response.json();
          console.error("Error fetching apps:", errorData.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchApps();
  }, [workspaceId]);

  if (loading) {
    return <div>Loading apps...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Apps</h2>
      {apps.length === 0 ? (
        <p>No apps found in this workspace.</p>
      ) : (
        <ul>
          {apps.map((app) => (
            <li key={app.id} className="mb-4">
              <Link
                to={`/workspaces/${workspaceId}/apps/${app.id}`}
                className="text-blue-600"
              >
                {app.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        to={`/workspaces/${workspaceId}/apps/new`}
        className="btn btn-primary mt-4"
      >
        Create New App
      </Link>
    </div>
  );
};

export default AppList;
