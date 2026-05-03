import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  phone: string;
  szemely_igazolvany_szam: string;
  city: string;
  street: string;
  postalcode: string;
};

const initialForm: RegisterForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  szemely_igazolvany_szam: "",
  city: "",
  street: "",
  postalcode: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof RegisterForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleRegister(event: React.SubmitEvent) {
    event.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.szemely_igazolvany_szam ||
      !form.city ||
      !form.street ||
      !form.postalcode
    ) {
      setError("Töltsd ki a kötelező mezőket.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/registrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          szemely_igazolvany_szam: Number(form.szemely_igazolvany_szam),
          address: {
            city: form.city,
            street: form.street,
            postalcode: Number(form.postalcode),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Sikertelen regisztráció:", response.status, errorData);
        setError("Sikertelen regisztráció. Ellenőrizd a megadott adatokat.");
        return;
      }

      navigate("/login", {
        replace: true,
        state: { message: "Sikeres regisztráció. Most már bejelentkezhetsz." },
      });
    } catch (err) {
      console.error("Regisztrációs hiba:", err);
      setError("Nem sikerült kapcsolódni a szerverhez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="login-page">
      <form className="login-form register-form" onSubmit={handleRegister}>
        <div className="login-heading">
          <h2>Regisztráció</h2>
          <p>Hozz létre felhasználót a foglalások kezeléséhez.</p>
        </div>

        {error && <p className="login-error">{error}</p>}

        <label className="login-field">
          <span>Név *</span>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </label>

        <label className="login-field">
          <span>Email *</span>
          <input
            name="email"
            type="email"
            placeholder="pelda@email.com"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </label>

        <label className="login-field">
          <span>Jelszó *</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
          />
        </label>

        <label className="login-field">
          <span>Telefonszám *</span>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
          />
        </label>

        <label className="login-field">
          <span>Személyi igazolvány szám *</span>
          <input
            name="szemely_igazolvany_szam"
            type="number"
            value={form.szemely_igazolvany_szam}
            onChange={(event) => updateField("szemely_igazolvany_szam", event.target.value)}
            required
          />
        </label>

        <div className="register-field-row">
          <label className="login-field">
            <span>Város *</span>
            <input
              name="city"
              type="text"
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
              required
            />
          </label>

          <label className="login-field">
            <span>Irányítószám *</span>
            <input
              name="postalcode"
              type="number"
              value={form.postalcode}
              onChange={(event) => updateField("postalcode", event.target.value)}
              required
            />
          </label>
        </div>

        <label className="login-field">
          <span>Utca, házszám *</span>
          <input
            name="street"
            type="text"
            value={form.street}
            onChange={(event) => updateField("street", event.target.value)}
            required
          />
        </label>

        <button className="login-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Regisztráció..." : "Regisztráció"}
        </button>

        <button
          className="login-link-button"
          type="button"
          onClick={() => navigate("/login")}
        >
          Már van fiókom
        </button>
      </form>
    </section>
  );
}
