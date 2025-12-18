'use client';

import { useState, useTransition } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import type { ThemeType } from '@/actions/types';
import type { PortfolioSection } from '@/actions/portfolios';
import TemplateSelector from './components/TemplateSelector';
import SectionList from './components/SectionList';
import SectionEditor from './components/SectionEditor';

export type EditorProfile = {
  id: string;
  slug: string;
  title: string;
  theme_type: ThemeType;
  bio: string | null;
  profile_image_url: string | null;
  open_chat_url: string | null;
  payment_link: string | null;
  location: string | null;
  specialties: string[];
  certifications: string[];
  instagram_username: string | null;
  youtube_channel_id: string | null;
  kakao_talk_id: string | null;
};

interface PortfolioEditorClientProps {
  profile: EditorProfile;
  initialSections: PortfolioSection[];
}

export default function PortfolioEditorClient({
  profile,
  initialSections,
}: PortfolioEditorClientProps) {
  const [activeTab, setActiveTab] = useState('design');
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(profile.theme_type);
  const [sections, setSections] = useState<PortfolioSection[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    sections[0]?.id || null
  );
  const [isPending, startTransition] = useTransition();

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || null;

  const handleThemeChange = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme);
  };

  const handleSectionsChange = (newSections: PortfolioSection[]) => {
    setSections(newSections);
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setActiveTab('content');
  };

  const handleSectionUpdate = (updatedSection: PortfolioSection) => {
    setSections((prev) =>
      prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 bg-tee-stone/30">
        <TabsTrigger
          value="design"
          className="data-[state=active]:bg-tee-surface data-[state=active]:text-tee-ink-strong"
        >
          디자인
        </TabsTrigger>
        <TabsTrigger
          value="sections"
          className="data-[state=active]:bg-tee-surface data-[state=active]:text-tee-ink-strong"
        >
          섹션 관리
        </TabsTrigger>
        <TabsTrigger
          value="content"
          className="data-[state=active]:bg-tee-surface data-[state=active]:text-tee-ink-strong"
        >
          콘텐츠 편집
        </TabsTrigger>
        <TabsTrigger
          value="preview"
          className="data-[state=active]:bg-tee-surface data-[state=active]:text-tee-ink-strong"
        >
          미리보기
        </TabsTrigger>
      </TabsList>

      {/* Design Tab - Template Selection */}
      <TabsContent value="design">
        <Card>
          <CardHeader>
            <CardTitle>템플릿 선택</CardTitle>
            <CardDescription>
              포트폴리오 스타일을 선택하세요. 템플릿을 변경해도 콘텐츠는 유지됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateSelector
              profileId={profile.id}
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              onSectionsChange={handleSectionsChange}
              disabled={isPending}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Sections Tab - Drag & Drop Reorder */}
      <TabsContent value="sections">
        <Card>
          <CardHeader>
            <CardTitle>섹션 관리</CardTitle>
            <CardDescription>
              섹션을 드래그하여 순서를 변경하거나, 새로운 섹션을 추가하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SectionList
              profileId={profile.id}
              sections={sections}
              themeType={currentTheme}
              onSectionsChange={handleSectionsChange}
              onSectionSelect={handleSectionSelect}
              disabled={isPending}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Content Tab - Section Editor */}
      <TabsContent value="content">
        <Card>
          <CardHeader>
            <CardTitle>콘텐츠 편집</CardTitle>
            <CardDescription>
              {selectedSection
                ? `"${selectedSection.title || selectedSection.section_type}" 섹션 편집 중`
                : '왼쪽에서 섹션을 선택하세요'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSection ? (
              <SectionEditor
                section={selectedSection}
                profile={profile}
                onUpdate={handleSectionUpdate}
                disabled={isPending}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <svg
                  className="h-12 w-12 text-tee-ink-light/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4 text-tee-ink-light">편집할 섹션이 없습니다.</p>
                <p className="text-sm text-tee-ink-muted">
                  &ldquo;섹션 관리&rdquo; 탭에서 섹션을 추가하거나 선택하세요.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Preview Tab - Live Preview */}
      <TabsContent value="preview">
        <Card>
          <CardHeader>
            <CardTitle>실시간 미리보기</CardTitle>
            <CardDescription>
              방문자에게 보이는 포트폴리오 화면입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-b-xl border-t border-tee-stone">
              <iframe
                src={`/${profile.slug}`}
                className="h-[600px] w-full"
                title="포트폴리오 미리보기"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
