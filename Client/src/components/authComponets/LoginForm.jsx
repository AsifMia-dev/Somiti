import { useState } from "react";
import { baseUrl } from "../../helper/baseUrlHelper";

function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>

      <a
        href="#"
        className="block text-xs text-[var(--accent-deep)] no-underline -mt-1.5 mb-1"
      >
        পাসওয়ার্ড ভুলে গেছেন?
      </a>

      <button
        type="submit"
        className="w-full text-sm font-medium py-3 rounded-[3px] bg-[var(--primary)] text-[#F6EFDD] hover:bg-[var(--primary-dark)]"
      >
        লগইন করুন
      </button>
    </form>
  );
}

export default LoginForm;
