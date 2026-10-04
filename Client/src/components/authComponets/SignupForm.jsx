import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"


import { AuthContext } from "../../context/AuthContext";
import { baseUrl } from "../../helper/baseUrlHelper";

function SignupForm() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "নাম আবশ্যক";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "সঠিক ইমেইল দিন";
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "সঠিক ফোন নম্বর দিন (01XXXXXXXXX)";
    }

    if (form.password.length < 6) {
      newErrors.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "পাসওয়ার্ড মিলছে না";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        login(data.data.accessToken);
        setTimeout(() => {
          navigate("/onboarding-wizard");
        }, 1000); 
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs mb-1.5 text-[var(--text)]">পূর্ণ নাম</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="আপনার নাম"
          className="w-full text-sm px-3 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[#A79E86] focus:outline-none focus:border-[var(--accent)]"
        />
        {errors.name && <p className="text-xs text-[var(--danger)] mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs mb-1.5 text-[var(--text)]">ইমেইল</label>
        <input
          type="text"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full text-sm px-3 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[#A79E86] focus:outline-none focus:border-[var(--accent)]"
        />
        {errors.email && <p className="text-xs text-[var(--danger)] mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-xs mb-1.5 text-[var(--text)]">ফোন নম্বর</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="০১XXXXXXXXX"
          className="w-full text-sm px-3 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[#A79E86] focus:outline-none focus:border-[var(--accent)]"
        />
        {errors.phone && <p className="text-xs text-[var(--danger)] mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-xs mb-1.5 text-[var(--text)]">পাসওয়ার্ড</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="পাসওয়ার্ড দিন"
          className="w-full text-sm px-3 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[#A79E86] focus:outline-none focus:border-[var(--accent)]"
        />
        {errors.password && <p className="text-xs text-[var(--danger)] mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-xs mb-1.5 text-[var(--text)]">পাসওয়ার্ড নিশ্চিত করুন</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="পুনরায় পাসওয়ার্ড দিন"
          className="w-full text-sm px-3 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[#A79E86] focus:outline-none focus:border-[var(--accent)]"
        />
        {errors.confirmPassword && <p className="text-xs text-[var(--danger)] mt-1">{errors.confirmPassword}</p>}
      </div>

     <button
        type="submit"
        disabled={loading}
        className="w-full text-sm font-medium py-3 rounded-[3px] bg-[var(--primary)] text-[#F6EFDD] hover:bg-[var(--primary-dark)] mt-1.5 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-[#F6EFDD] border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
      </button>
    </form>
  );
}

export default SignupForm;