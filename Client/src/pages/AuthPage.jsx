import { useState } from "react"
import SignupForm from "../components/authComponets/SignupForm"
import LoginForm from "../components/authComponets/LoginForm"

function AuthPage() {
  const [tab, setTab] = useState('signup')
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--primary)]">
      <div className="w-[400px] bg-[var(--bg-raised)] rounded-md px-[34px] pt-9 pb-[30px]">

        {/* heading */}
        <div className="text-center mb-6">
          <h1 className="text-xl mb-1">
            {tab === 'signup' ? 'আপনার সমিতি তৈরি করুন' : 'আবার স্বাগতম'}
          </h1>
          <div className="text-[13px] text-[var(--text)]">
            {tab === 'signup'
              ? 'নতুন অ্যাকাউন্ট খুলে আপনার সমিতি পরিচালনা শুরু করুন'
              : 'চালিয়ে যেতে আপনার অ্যাকাউন্টে লগইন করুন'}
          </div>
        </div>

        {/* tabs */}
        <div className="flex bg-[var(--bg)] border border-[var(--border)] rounded-full p-[3px] mb-[26px]">
          <div
            onClick={() => setTab('login')}
            className={`flex-1 text-center py-2 text-[13.5px] font-medium rounded-full cursor-pointer ${
              tab === 'login' ? 'bg-[var(--primary)] text-[#F6EFDD]' : 'text-[var(--text)]'
            }`}
          >
            লগইন
          </div>
          <div
            onClick={() => setTab('signup')}
            className={`flex-1 text-center py-2 text-[13.5px] font-medium rounded-full cursor-pointer ${
              tab === 'signup' ? 'bg-[var(--primary)] text-[#F6EFDD]' : 'text-[var(--text)]'
            }`}
          >
            সাইন আপ
          </div>
        </div>

        {tab === 'signup' ? <SignupForm /> : <LoginForm />}

        <div className="text-center text-[12.5px] text-[var(--text)] mt-5">
          {tab === 'signup' ? (
            <>ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <a onClick={() => setTab('login')} className="text-[var(--accent-deep)] font-medium cursor-pointer">লগইন করুন</a>
            </>
          ) : (
            <>নতুন ব্যবহারকারী?{' '}
              <a onClick={() => setTab('signup')} className="text-[var(--accent-deep)] font-medium cursor-pointer">সাইন আপ করুন</a>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default AuthPage