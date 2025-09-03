import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchAnnouncements } from "../api";

const AnnouncementsList = () => {
  const [etag, setEtag] = useState<string | undefined>();

  const { data, isLoading, error } = useQuery(
    ["announcements", etag],
    () => fetchAnnouncements(etag),
    { refetchInterval: 5000 }
  );

  useEffect(() => {
    if (data?.etag) setEtag(data.etag);
  }, [data]);

  if (isLoading) return <p>Loading announcements...</p>;
  if (error) return <p>Error loading announcements</p>;
  if (!data?.data || data.data.length === 0) return <p>No announcements yet</p>;

  return (
    <div>
      <h1>Announcements</h1>
      <ul>
        {data.data.map((ann: any) => (
          <li key={ann.id} style={{ marginBottom: "1rem" }}>
            <Link to={`/announcements/${ann.id}`}>{ann.title}</Link>
            <p>
              Comments: {ann.commentCount} | ❤️ {ann.reactions.heart || 0} 👍 {ann.reactions.up || 0} 👎 {ann.reactions.down || 0}
            </p>
            <small>Last activity: {new Date(ann.lastActivityAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementsList;
