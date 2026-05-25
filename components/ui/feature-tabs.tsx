import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature108 = ({
  badge = "SpendLens",
  heading = "How SpendLens saves your team money",
  description = "Three steps from spend chaos to clarity.",
  tabs = [],
}: Feature108Props) => {
  if (tabs.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="text-[#71717A] border-[#27272A]">
            {badge}
          </Badge>
          <h2 className="max-w-2xl text-2xl font-semibold md:text-3xl text-[#FAFAFA]">
            {heading}
          </h2>
          <p className="text-[#71717A] text-sm">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-10">
          <TabsList className="flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#52525B]
                  data-[state=active]:bg-[#18181B] data-[state=active]:text-[#FAFAFA]
                  data-[state=active]:border data-[state=active]:border-[#27272A]
                  hover:text-[#A1A1AA] transition-colors cursor-pointer"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 rounded-xl bg-[#18181B]/70 border border-[#27272A] p-6 lg:p-12">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-12 lg:grid-cols-2 lg:gap-10"
              >
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-medium text-[#52525B] uppercase tracking-wider">
                    {tab.content.badge}
                  </span>
                  <h3 className="text-2xl font-semibold lg:text-3xl text-[#FAFAFA] leading-tight">
                    {tab.content.title}
                  </h3>
                  <p className="text-[#71717A] text-sm leading-relaxed">
                    {tab.content.description}
                  </p>
                </div>
                <img
                  src={tab.content.imageSrc}
                  alt={tab.content.imageAlt}
                  className="rounded-lg border border-[#27272A] w-full"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
