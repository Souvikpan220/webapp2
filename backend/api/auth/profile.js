export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false
    });
  }

  try {
    return res.status(200).json({
      ok: true,
      profile: {
        username: "kaddu",
        followers: 120000,
        following: 120,
        likes: 450000,
        videos: 32,
        verified: true,
        avatar: "https://i.pravatar.cc/300"
      }
    });
  } catch (err) {
    return res.status(500).json({
      ok: false
    });
  }
}
