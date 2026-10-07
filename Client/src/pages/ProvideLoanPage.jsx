import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import { SomitiContext } from "../context/SomitiContext";
import { baseUrl } from "../helper/baseUrlHelper";
import BackButton from "../components/BackButton";

function ProvideLoanPage() {
  const { accessToken } = useContext(AuthContext);
  const { somiti } = useContext(SomitiContext);
  const navigate = useNavigate();

  const [borrowers, setBorrowers] = useState([]);
  const [loanType, setLoanType] = useState("NEW");
  const [form, setForm] = useState({
    borrower_id: "",
    loan_amount: "",
    interest_rate: "10",
    total_installment: "",
  });
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!somiti?.id) return;
    fetch(`${baseUrl}/borrowers/${somiti.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setBorrowers(data.data))
      .catch((err) => console.error(err));
  }, [somiti?.id]);

  useEffect(() => {
    const amount = parseFloat(form.loan_amount) || 0;
    const rate = parseFloat(form.interest_rate) || 0;
    const duration = parseInt(form.total_installment) || 0;

    if (amount > 0 && duration > 0) {
      const totalPayable = amount + (amount * rate) / 100;
      setInstallmentAmount(Math.ceil(totalPayable / duration));
    } else {
      setInstallmentAmount(0);
    }
  }, [form.loan_amount, form.interest_rate, form.total_installment]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.borrower_id) newErrors.borrower_id = "ঋণগ্রহীতা নির্বাচন করুন";
    if (!form.loan_amount || Number(form.loan_amount) <= 0) newErrors.loan_amount = "ঋণের পরিমাণ দিতে হবে";
    if (!form.total_installment || Number(form.total_installment) <= 0) newErrors.total_installment = "মেয়াদ দিতে হবে";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const [res] = await Promise.all([
        fetch(`${baseUrl}/loans`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            loan_type: loanType,
            loan_amount: Number(form.loan_amount),
            interest_rate: Number(form.interest_rate),
            total_installment: Number(form.total_installment),
            installment_amount: installmentAmount,
            savings: 0,
            frequency: "WEEKLY",
            borrower_id: Number(form.borrower_id),
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "ঋণ সফলভাবে প্রদান করা হয়েছে");
        navigate("/loans");
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
      <div className="w-[640px]">
        <BackButton label="ঋণ তালিকায় ফিরে যান" />

        <div className="mb-6">
          <h1 className="text-[23px] mb-1">ঋণ প্রদান</h1>
          <div className="text-sm text-[var(--text)]">নতুন ঋণ প্রদান করুন অথবা বিদ্যমান ঋণে টপ-আপ করুন</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-[5px] p-9">
          <div className="text-right mb-[18px]">
            <label className="block text-xs text-[var(--text)] mb-1.5">
              ঋণগ্রহীতা নির্বাচন করুন <span className="text-[var(--danger)]">*</span>
            </label>
            <select
              name="borrower_id"
              value={form.borrower_id}
              onChange={handleChange}
              className="w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-right"
            >
              <option value="">— নির্বাচন করুন —</option>
              {borrowers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.full_name} — খাতা #{String(b.id).padStart(4, "0")}
                </option>
              ))}
            </select>
            {errors.borrower_id && <p className="text-[11.5px] text-[var(--danger)] mt-1">{errors.borrower_id}</p>}
          </div>

          <div className="flex gap-2.5 mb-[22px]">
            <div
              onClick={() => setLoanType("NEW")}
              className={`flex-1 text-center py-3 rounded-[3px] border text-[13.5px] cursor-pointer ${
                loanType === "NEW"
                  ? "border-[var(--accent)] bg-[rgba(184,132,46,0.08)] text-[var(--text-h)] font-medium"
                  : "border-[var(--border)] text-[var(--text)]"
              }`}
            >
              নতুন ঋণ
            </div>
            <div
              onClick={() => setLoanType("TOPUP")}
              className={`flex-1 text-center py-3 rounded-[3px] border text-[13.5px] cursor-pointer ${
                loanType === "TOPUP"
                  ? "border-[var(--accent)] bg-[rgba(184,132,46,0.08)] text-[var(--text-h)] font-medium"
                  : "border-[var(--border)] text-[var(--text)]"
              }`}
            >
              টপ-আপ ঋণ
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-right mb-[18px]">
              <label className="block text-xs text-[var(--text)] mb-1.5">
                ঋণের পরিমাণ (৳) <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="text"
                name="loan_amount"
                value={form.loan_amount}
                onChange={handleChange}
                placeholder="১০,০০০"
                className={`w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border text-right ${
                  errors.loan_amount ? "border-[var(--danger)] bg-[var(--danger-bg)]" : "border-[var(--border)] bg-[var(--bg)]"
                }`}
              />
              {errors.loan_amount && <p className="text-[11.5px] text-[var(--danger)] mt-1">{errors.loan_amount}</p>}
            </div>
            <div className="text-right mb-[18px]">
              <label className="block text-xs text-[var(--text)] mb-1.5">
                সুদের হার (%) <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="text"
                name="interest_rate"
                value={form.interest_rate}
                onChange={handleChange}
                className="w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-right mb-[18px]">
              <label className="block text-xs text-[var(--text)] mb-1.5">
                মেয়াদ (সপ্তাহ) <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="text"
                name="total_installment"
                value={form.total_installment}
                onChange={handleChange}
                placeholder="২৬"
                className={`w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border text-right ${
                  errors.total_installment ? "border-[var(--danger)] bg-[var(--danger-bg)]" : "border-[var(--border)] bg-[var(--bg)]"
                }`}
              />
              {errors.total_installment && <p className="text-[11.5px] text-[var(--danger)] mt-1">{errors.total_installment}</p>}
            </div>
            <div className="text-right mb-[18px]">
              <label className="block text-xs text-[var(--text)] mb-1.5">সাপ্তাহিক কিস্তি (৳)</label>
              <input
                type="text"
                readOnly
                value={installmentAmount ? `৳${installmentAmount.toLocaleString("bn-BD")}` : ""}
                className="w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[#EFE9D8] text-[var(--accent-deep)] font-mono font-medium text-right"
              />
              <div className="text-[11.5px] text-[var(--text)] mt-1.5">পরিমাণ, সুদ ও মেয়াদ থেকে হিসাব করা হয়েছে</div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-sm font-medium py-3 rounded-[3px] bg-[var(--primary)] text-[#F6EFDD] hover:bg-[var(--primary-dark)] disabled:opacity-60"
            >
              {loading ? "..." : "ঋণ প্রদান করুন"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm font-medium px-5 py-3 rounded-[3px] border border-[var(--border)] bg-[var(--bg-raised)]"
            >
              বাতিল করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProvideLoanPage;