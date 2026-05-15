import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useProfile(tiktokUrl: string) {
const [profile, setProfile] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadProfile() {
setLoading(true);

```
  const res = await api.getProfile(tiktokUrl);

  if (res.ok) {
    setProfile(res.profile);
  }

  setLoading(false);
}

if (tiktokUrl) {
  loadProfile();
}
```

}, [tiktokUrl]);

return {
profile,
loading
};
}
