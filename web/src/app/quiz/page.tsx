import type { Metadata } from 'next';
import QuizWizard from './components/QuizWizard';

export const metadata: Metadata = {
  title: '맞춤 프로 매칭 | TEE:UP',
  description:
    '5문항 퀴즈로 나에게 딱 맞는 골프 프로를 추천받으세요. 실력, 목표, 스타일에 따른 맞춤 매칭.',
  openGraph: {
    title: '맞춤 프로 매칭 | TEE:UP',
    description: '5문항 퀴즈로 나에게 딱 맞는 골프 프로를 추천받으세요.',
    type: 'website',
  },
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-tee-background">
      <QuizWizard />
    </div>
  );
}
