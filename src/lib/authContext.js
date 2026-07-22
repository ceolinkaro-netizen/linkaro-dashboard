import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";

const PUBLIC_PATHS = ["/", "/privacy-policy", "/terms-of-services", "/data-deletion"];

const ROLE_HOME = {
  "user manager": "/admin/user-management",
  "ticket manager": "/ticket-management",
};

// Paths every authenticated role can access (in addition to their ROLE_HOME)
const SHARED_ALLOWED_PATHS = ["/settings/profile"];

const AuthContext = createContext({
  role: null,
  name: null,
  profileImage: null,
  setName: () => {},
  setProfileImage: () => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (PUBLIC_PATHS.includes(router.pathname)) {
      setLoading(false);
      return;
    }

    setLoading(true);

    apiFetch("/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data.success) throw new Error("unauthorized");

        setRole(data.role);
        setName(data.name || null);
        setProfileImage(data.profileImage || null);

        const home = ROLE_HOME[data.role];
        if (home && router.pathname !== home && !SHARED_ALLOWED_PATHS.includes(router.pathname)) {
          router.replace(home);
          return;
        }

        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        router.replace("/");
      });

    return () => {
      cancelled = true;
    };
  }, [router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const isPublic = PUBLIC_PATHS.includes(router.pathname);

  return (
    <AuthContext.Provider value={{ role, name, profileImage, setName, setProfileImage, loading }}>
      {isPublic || !loading ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
