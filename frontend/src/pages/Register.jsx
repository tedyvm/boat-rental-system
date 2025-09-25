import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    try {
      setServerError("");
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, data);
      navigate("/login"); // redirect po sėkmingos registracijos
    } catch (err) {
      setServerError(err.response?.data?.message || "Registracija nepavyko");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Registracija</h2>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Vardas */}
          <div className="mb-3">
            <label className="form-label">Vardas</label>
            <input
              type="text"
              {...register("name", { required: "Vardas privalomas" })}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          {/* Pavardė */}
          <div className="mb-3">
            <label className="form-label">Pavardė</label>
            <input
              type="text"
              {...register("familyName", { required: "Pavardė privaloma" })}
              className={`form-control ${
                errors.familyName ? "is-invalid" : ""
              }`}
            />
            {errors.familyName && (
              <div className="invalid-feedback">
                {errors.familyName.message}
              </div>
            )}
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Vartotojo vardas</label>
            <input
              type="text"
              {...register("username", {
                required: "Vartotojo vardas privalomas",
              })}
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>

          {/* El. paštas */}
          <div className="mb-3">
            <label className="form-label">El. paštas</label>
            <input
              type="email"
              {...register("email", {
                required: "El. paštas privalomas",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Neteisingas el. pašto formatas",
                },
              })}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Telefono numeris */}
          <div className="mb-3">
            <label className="form-label">Telefonas</label>
            <input
              type="tel"
              {...register("phone", {
                required: "Telefono numeris privalomas",
                pattern: {
                  value: /^\+?[0-9]{6,15}$/,
                  message: "Neteisingas telefono numeris",
                },
              })}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone.message}</div>
            )}
          </div>

          {/* Šalis */}
          <div className="mb-3">
            <label className="form-label">Šalis</label>
            <input
              type="text"
              {...register("country", { required: "Šalis privaloma" })}
              className={`form-control ${errors.country ? "is-invalid" : ""}`}
            />
            {errors.country && (
              <div className="invalid-feedback">{errors.country.message}</div>
            )}
          </div>

          {/* Slaptažodis */}
          <div className="mb-3">
            <label className="form-label">Slaptažodis</label>
            <input
              type="password"
              {...register("password", {
                required: "Slaptažodis privalomas",
                minLength: {
                  value: 6,
                  message: "Slaptažodis turi būti bent 6 simbolių",
                },
              })}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          {/* Pakartoti slaptažodį */}
          <div className="mb-3">
            <label className="form-label">Pakartoti slaptažodį</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Pakartoti slaptažodį privaloma",
                validate: (val) =>
                  val === watch("password") || "Slaptažodžiai nesutampa",
              })}
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Registruotis
          </button>
        </form>
      </div>
    </div>
  );
}
