import React, { useEffect, useState } from "react";
import { Chrono } from "react-chrono";
import { getJobApplications } from "app/clientAPI";

const MyTimeline = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getJobApplications();
        const timelineItems = (data || []).map((job) => ({
          title: new Date(job.date_applied).toLocaleDateString("en-US"),
          cardTitle: `${job.status.charAt(0).toUpperCase() + job.status.slice(1)}`,
          cardSubtitle: job.company,
          
        }));
        // console.log("Timeline Items:", timelineItems); // Debug log
        setItems(timelineItems);
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div style={{ width: "100%", height: "470px" }}>
      {items.length > 0 ? (
        <Chrono
          items={items}
          mode="HORIZONTAL"
          theme={{
            primary: "blue",
            secondary: "lightblue",
            cardBgColor: "white",
            cardForeColor: "black",
          }}
          cardWidth={200}
        />
      ) : (
        <p>Loading timeline...</p>
      )}
    </div>
  );
};

export default MyTimeline;
