export default async function handler(req, res) {
  try {
    const { link } = req.body;

    const response = await fetch(
      "https://cheapestsmmpanels.com/api/v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          key: process.env.SMM_API_KEY,
          action: "add",
          service: "3080",
          link,
          quantity: "100"
        })
      }
    );

    const data = await response.text();

    console.log(data);

    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Failed to place order"
    });
  }
}
