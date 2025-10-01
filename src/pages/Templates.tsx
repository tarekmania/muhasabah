import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplatesGallery } from '@/components/templates-gallery';
import { QuickTemplate } from '@/types';
import { useCatalog } from '@/hooks/use-catalog';
import { toast } from '@/hooks/use-toast';

export default function Templates() {
  const navigate = useNavigate();
  const { catalog, usageStats } = useCatalog();

  const handleApplyTemplate = (template: QuickTemplate) => {
    toast({
      title: "Template Applied",
      description: `${template.title} has been applied. Now create your entry.`,
    });
    navigate('/entry');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <TemplatesGallery
        templates={catalog.templates}
        catalogItems={catalog.items}
        usageStats={usageStats}
        onApplyTemplate={handleApplyTemplate}
      />
    </div>
  );
}
