import { useEffect, useState } from "react";
import { FOLDER_ENDPOINTS } from "../api/endpoint";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/1200x/17/c0/d1/17c0d1bfcef18ad4a83d5b5b95f328df.jpg";

const AllCollaborators = ({ folderId }) => {
  const [participants, setParticipants] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!folderId) return;

    const fetchParticipants = async () => {
      try {
        const res = await fetch(FOLDER_ENDPOINTS.GET_PARTICIPANTS(folderId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setParticipants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [folderId, token]);

  if (loading || !participants) return null;

  const users = [
    { ...participants.owner, role: "Admin" },
    ...participants.collaborators.map((u) => ({
      ...u,
      role: "Collaborator",
    })),
  ];

  return (
    <div className="flex flex-col justify-center">
       {/* <h1 className="text-lg py-4 font-semibold text-[var(--text-main)]">All Collaborators</h1> */}
      <div className="flex -space-x-5 pr-3">
        {users.map((user, index) => (
          <div key={user._id} className="group relative">
            {/* Tooltip */}
            <div className="absolute pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 -top-16 right-0 transition-all duration-300 pl-4 pr-12 py-2 rounded border border-[var(--border-light)] bg-[var(--bg-main)] text-nowrap shadow-lg">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <p className="font-medium text-[var(--text-main)]">
                    {user.firstName} {user.lastName}
                  </p>

                  {user.role === "Admin" && (
                    <svg
                      className="mt-0.5"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38c-.042.21-.125.411-.245.59-.052.078-.114.151-.239.297-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
                        fill="#2196F3"
                      />
                    </svg>
                  )}
                </div>

                <span className="text-xs text-[var(--text-muted)]">
                  {user.role}
                </span>
              </div>

              <div className="size-3 border-r border-b border-[var(--border-light)] bg-[var(--bg-main)] rotate-45 absolute right-4 -bottom-[7px]" />
            </div>

            {/* Avatar */}
            <img
              src={user.avatar || DEFAULT_AVATAR}
              alt="user"
              className="size-9 rounded-full group-hover:-translate-x-3 transition-all duration-300 z-10"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCollaborators;
