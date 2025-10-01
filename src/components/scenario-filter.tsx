import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScenarioContext } from '@/types';
import { Briefcase, Plane, Users, Home, Building2, BookOpen } from 'lucide-react';

interface ScenarioFilterProps {
  selected: ScenarioContext | 'all';
  onSelect: (scenario: ScenarioContext | 'all') => void;
}

const scenarios: Array<{ value: ScenarioContext | 'all'; label: string; icon: React.ElementType }> = [
  { value: 'all', label: 'All', icon: BookOpen },
  { value: 'workplace', label: 'Workplace', icon: Briefcase },
  { value: 'travel', label: 'Travel', icon: Plane },
  { value: 'social', label: 'Social', icon: Users },
  { value: 'home', label: 'Home', icon: Home },
  { value: 'mosque', label: 'Mosque', icon: Building2 },
];

export function ScenarioFilter({ selected, onSelect }: ScenarioFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {scenarios.map((scenario) => {
        const Icon = scenario.icon;
        const isSelected = selected === scenario.value;
        
        return (
          <Badge
            key={scenario.value}
            variant={isSelected ? "default" : "outline"}
            className="cursor-pointer hover:bg-accent whitespace-nowrap"
            onClick={() => onSelect(scenario.value)}
          >
            <Icon className="h-3 w-3 mr-1" />
            {scenario.label}
          </Badge>
        );
      })}
    </div>
  );
}
