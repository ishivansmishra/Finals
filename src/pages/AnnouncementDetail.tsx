import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchComments, postComment, postReaction } from "../api";

const AnnouncementDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const userId = "user-123";
  const [commentText, setCommentText] = useState("");
  const [cursor, setCursor] = useState<string | undefined>();

  const { data: commentsData, isLoading } = useQuery(
    ["comments", id, cursor],
    () => fetchComments(id!, cursor),
    { keepPreviousData: true, refetchInterval: 5000 }
  );

  const addCommentMutation = useMutation(
    (text: string) => postComment(id!, { authorName: "User", text }),
    {
      onMutate: async (text) => {
        await queryClient.cancelQueries(["comments", id]);
        const previous = queryClient.getQueryData(["comments", id]);
        queryClient.setQueryData(["comments", id], (old: any) => [
          { id: Math.random(), authorName: "User", text, createdAt: new Date() },
          ...old
        ]);
        return { previous };
      },
      onError: (_err, _text, context: any) =>
        queryClient.setQueryData(["comments", id], context.previous),
      onSettled: () => queryClient.invalidateQueries(["comments", id]),
    }
  );

  const reactionMutation = useMutation(
    (type: 'up' | 'down' | 'heart') => postReaction(id!, type, userId),
    { onSettled: () => queryClient.invalidateQueries("announcements") }
  );

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText);
    setCommentText("");
  };

  const handleReaction = (type: 'up' | 'down' | 'heart') =>
    reactionMutation.mutate(type);

  if (isLoading) return <p>Loading comments...</p>;

  return (
    <div>
      <h2>Announcement Detail</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => handleReaction('up')} disabled={reactionMutation.isLoading}>👍</button>
        <button onClick={() => handleReaction('down')} disabled={reactionMutation.isLoading}>👎</button>
        <button onClick={() => handleReaction('heart')} disabled={reactionMutation.isLoading}>❤️</button>
      </div>

      <h3>Comments</h3>
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={handleAddComment} disabled={addCommentMutation.isLoading}>Submit</button>

      <ul>
        {commentsData?.map((c: any) => (
          <li key={c.id}>
            <b>{c.authorName}</b>: {c.text} <small>{new Date(c.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      {commentsData?.length === 5 && (
        <button onClick={() => setCursor(commentsData[commentsData.length - 1].id)}>Load More</button>
      )}
    </div>
  );
};

export default AnnouncementDetail;
