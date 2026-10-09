import { useState, useContext } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SomitiContext } from "../context/SomitiContext";
import { baseUrl } from "../helper/baseUrlHelper";
import BackButton from "../components/BackButton";

function AddBorrowerPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    nid: "",
    fatherNname: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { accessToken } = useContext(AuthContext);
  const { somiti } = useContext(SomitiContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "পূর্ণ নাম দিতে হবে";

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(form.phone)) newErrors.phone = "সঠিক ফোন নম্বর দিন";

    if (!form.nid.trim()) newErrors.nid = "এনআইডি নম্বর দিতে হবে";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    console.log(form);
    try {
      const [res] = await Promise.all([
        fetch(`${baseUrl}/borrowers/${somiti.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(form),
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "ঋণগ্রহীতা সফলভাবে যুক্ত হয়েছে");
        navigate("/borrowers");
      } else {
        toast.error(data.error || "কিছু ভুল হয়েছে");
      }
    } catch (err) {
      console.error(err);
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="flex justify-center">
      <div className="w-[600px]">
        <BackButton/>

        <div className="mb-6">
          <h1 className="text-[23px] mb-1">ঋণগ্রহীতা যোগ করুন</h1>
          <div className="text-sm text-[var(--text)]">
            নতুন ঋণগ্রহীতার পরিচয় যুক্ত করুন — একটি খাতা নম্বর স্বয়ংক্রিয়ভাবে বরাদ্দ হবে
          </div>
        </div>

        <div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-[5px] p-9">
          <form onSubmit={handleSubmit}>
            <div className="text-xs font-semibold text-[var(--accent-deep)] mt-0 mb-3">পরিচয়</div>


            <div className="text-right mb-4">
              <label className="block text-xs text-[var(--text)] mb-1.5">
                পূর্ণ নাম <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="ঋণগ্রহীতার পূর্ণ নাম"
                className={`w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border text-right ${
                  errors.full_name ? "border-[var(--danger)] bg-[var(--danger-bg)]" : "border-[var(--border)] bg-[var(--bg)]"
                }`}
              />
              {errors.full_name && <p className="text-[11.5px] text-[var(--danger)] mt-1">{errors.full_name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-right mb-4">
                <label className="block text-xs text-[var(--text)] mb-1.5">
                  ফোন নম্বর <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="০১XXXXXXXXX"
                  className={`w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border text-right ${
                    errors.phone ? "border-[var(--danger)] bg-[var(--danger-bg)]" : "border-[var(--border)] bg-[var(--bg)]"
                  }`}
                />
                {errors.phone && <p className="text-[11.5px] text-[var(--danger)] mt-1">{errors.phone}</p>}
              </div>

              <div className="text-right mb-4">
                <label className="block text-xs text-[var(--text)] mb-1.5">
                  এনআইডি নম্বর <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  name="nid"
                  value={form.nid}
                  onChange={handleChange}
                  placeholder="জাতীয় পরিচয়পত্র নম্বর"
                  className={`w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border text-right ${
                    errors.nid ? "border-[var(--danger)] bg-[var(--danger-bg)]" : "border-[var(--border)] bg-[var(--bg)]"
                  }`}
                />
                {errors.nid && <p className="text-[11.5px] text-[var(--danger)] mt-1">{errors.nid}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-right mb-4">
                <label className="block text-xs text-[var(--text)] mb-1.5">পিতার নাম</label>
                <input
                  type="text"
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handleChange}
                  placeholder="পিতার নাম"
                  className="w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-right"
                />
              </div>
              <div className="text-right mb-4">
                <label className="block text-xs text-[var(--text)] mb-1.5">গ্রাম / ঠিকানা</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="গ্রামের নাম"
                  className="w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-right"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-sm font-medium py-3 rounded-[3px] bg-[var(--primary)] text-[#F6EFDD] hover:bg-[var(--primary-dark)] disabled:opacity-60"
              >
                {loading ? "..." : "ঋণগ্রহীতা যোগ করুন"}
              </button>
              <button type="button" className="text-sm font-medium px-5 py-3 rounded-[3px] border border-[var(--border)] bg-[var(--bg-raised)]">
                বাতিল করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
  );
}

export default AddBorrowerPage;