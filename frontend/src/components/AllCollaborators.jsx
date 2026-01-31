import { useEffect, useState } from "react";
import { FOLDER_ENDPOINTS } from "../api/endpoint";

const AllCollaborators = ({ folderId }) => {
  const [participants, setParticipants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!folderId) return;

    const fetchParticipants = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(FOLDER_ENDPOINTS.GET_PARTICIPANTS(folderId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch participants");
        }

        const data = await res.json();
        setParticipants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [folderId, token]);

  if (loading) {
    return (
      <div className="text-sm text-[var(--text-muted)]">
        Loading collaborators...
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-[var(--error)]">{error}</div>;
  }

  if (!participants) return null;

  const { owner, collaborators } = participants;

  return (
    <div className="bg-[var(--bg-secondary)]/20 border border-[var(--border-light)]/50 rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-semibold text-[var(--text-main)]">
        Folder Participants
      </h3>

      {/* Owner */}
      <div>
        <p className="text-sm text-[var(--text-muted)] mb-1">Owner</p>
        <div className="flex items-center justify-between bg-[var(--bg-main)] rounded-lg px-3 py-2">
          <span className="text-[var(--text-main)]">
            {owner.firstName} {owner.lastName}
          </span>
          <span className="text-xs text-[var(--accent-primary)] font-medium">
            Admin
          </span>
        </div>
      </div>

      {/* Collaborators */}
      <div>
        <p className="text-sm text-[var(--text-muted)] mb-1">
          Collaborators ({collaborators.length})
        </p>

        {collaborators.length === 0 ? (
          <p className="text-sm italic text-[var(--text-muted)]">
            No collaborators yet
          </p>
        ) : (
          <div className="space-y-2">
            {collaborators.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-[var(--bg-main)] rounded-lg px-3 py-2"
              >
                <span className="text-[var(--text-main)]">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  Collaborator
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCollaborators;
