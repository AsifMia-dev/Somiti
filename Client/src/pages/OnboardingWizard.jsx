import { useState,useContext, use } from "react";
import { useNavigate } from "react-router-dom";

import ProgressBar from "../components/wizardComponents/ProgressBar";
import StepSomitiName from "../components/wizardComponents/StepSomitiName";
import WizardNav from "../components/wizardComponents/WizardNav";
import StepMoneyField from "../components/wizardComponents/StepMoneyField";
import StepReview from "../components/wizardComponents/StepReview";
import StepCollectionSchedule from "../components/wizardComponents/StepCollectionSchedule";

import { toast } from "sonner"

import { baseUrl } from "../helper/baseUrlHelper";
import { AuthContext } from "../context/AuthContext";
import { SomitiContext } from "../context/SomitiContext";

const totalSteps = 6;

function OnboardingWizard() {
  const navigate = useNavigate();
  const {storeSomiti,somiti} = useContext(SomitiContext);

  if(somiti){
    navigate("/dashboard")
  }

  const [current, setCurrent] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    collection_day:"THURSDAY",
    monthly_collection_date:"5",
    netValue:0,
    handValue: 0,
    loan_balance: 0,
  });

  const [loading, setLoading] = useState(false);

  const goNext = () => {
    if (current === 1 && !formData.name) {
    toast.error("সমিতির নাম আবশ্যক");
    return;
  }
    if (current < totalSteps) setCurrent(current + 1);
  };

  const goBack = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { user, accessToken } = useContext(AuthContext);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        fetch(`${baseUrl}/somitis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      const data = await res.json();

      if (res.ok && user.sub === data.data.owner_manager_id) {
        const {id,name,owner_manager_id} = data.data;
        const somitiData = {
          id,
          name,
          owner_manager_id
        }
        storeSomiti(somitiData)

        toast.success(data.message);
        navigate("/dashboard");

      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--primary)]">
      <div className="w-[440px] bg-[var(--bg-raised)] rounded-md px-9 pt-[34px] pb-[30px]">

        <div className="w-[38px] h-[38px] mb-[18px] rounded-full border-[1.5px] border-[var(--accent-deep)] flex items-center justify-center font-serif text-[16px] font-semibold text-[var(--accent-deep)]">
          সো
        </div>

        <ProgressBar current={current} total={totalSteps} />
        
        {current === 1 && <StepSomitiName formData={formData} handleChange={handleChange} />}

        {current === 2 && (
        <StepMoneyField
          stepNumber={2} totalSteps={6}
          title="নিট মূল্য" subtitle="সমিতির বর্তমান মোট নিট মূল্য জানা থাকলে দিন, না হলে খালি রাখুন"
          fieldName="netValue" formData={formData} handleChange={handleChange}
        />
        )}
        {current === 3 && (
          <StepMoneyField
            stepNumber={3} totalSteps={6}
            title="নগদ ব্যালেন্স" subtitle="সমিতির হাতে বর্তমানে থাকা নগদ অর্থের পরিমাণ"
            fieldName="handValue" formData={formData} handleChange={handleChange}
          />
        )}
        {current === 4 && (
          <StepMoneyField
            stepNumber={4} totalSteps={6}
            title="ঋণ ব্যালেন্স" subtitle="বর্তমানে বাইরে বিতরণ করা মোট ঋণের পরিমাণ"
            fieldName="loan_balance" formData={formData} handleChange={handleChange}
          />
        )}
        {current === 5 && <StepCollectionSchedule formData={formData} handleChange={handleChange} />}
        {current === 6 && <StepReview formData={formData} />}

        <WizardNav
          current={current}
          totalSteps={totalSteps}
          goBack={goBack}
          goNext={current === totalSteps ? handleSubmit : goNext}
          loading={loading}
        />

      </div>
    </div>
  );
}

export default OnboardingWizard;