import React from 'react';
import { Entry, CatalogItem, DailyLedger as DailyLedgerType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, BookOpen } from 'lucide-react';

interface DailyLedgerProps {
  entry: Entry | null;
  catalogItems: CatalogItem[];
  date: string;
}

export function DailyLedger({ entry, catalogItems, date }: DailyLedgerProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getItemById = (id: string) => {
    return catalogItems.find(item => item.id === id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GOOD': return 'bg-green-100 text-green-800';
      case 'IMPROVE': return 'bg-orange-100 text-orange-800';
      case 'SEVERE': return 'bg-red-100 text-red-800';
      case 'MISSED_OPPORTUNITY': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'GOOD': return 'Good Deed';
      case 'IMPROVE': return 'To Improve';
      case 'SEVERE': return 'Severe';
      case 'MISSED_OPPORTUNITY': return 'Missed Opportunity';
      default: return type;
    }
  };

  // Collect all entries into a flat array
  const allEntries: Array<{
    itemId: string;
    title: string;
    count: number;
    type: string;
    context?: string;
    note?: string;
    tawbah?: boolean;
    intention?: string;
    guidance?: string;
  }> = [];

  if (entry) {
    // Good deeds
    if (entry.good?.itemIds) {
      entry.good.itemIds.forEach(itemId => {
        const item = getItemById(itemId);
        if (item) {
          allEntries.push({
            itemId,
            title: item.title,
            count: entry.good?.qty?.[itemId] || 1,
            type: 'GOOD',
            context: item.context,
            note: entry.good?.note
          });
        }
      });
    }

    // Areas to improve
    if (entry.improve?.itemIds) {
      entry.improve.itemIds.forEach(itemId => {
        const item = getItemById(itemId);
        if (item) {
          allEntries.push({
            itemId,
            title: item.title,
            count: entry.improve?.qty?.[itemId] || 1,
            type: 'IMPROVE',
            context: item.context,
            note: entry.improve?.note,
            tawbah: entry.improve?.tawbah
          });
        }
      });
    }

    // Severe slips
    if (entry.severeSlip?.itemIds) {
      entry.severeSlip.itemIds.forEach(itemId => {
        const item = getItemById(itemId);
        if (item) {
          allEntries.push({
            itemId,
            title: item.title,
            count: entry.severeSlip?.qty?.[itemId] || 1,
            type: 'SEVERE',
            context: item.context,
            note: entry.severeSlip?.note,
            tawbah: entry.severeSlip?.tawbah,
            guidance: entry.severeSlip?.guidance
          });
        }
      });
    }

    // Missed opportunities
    if (entry.missedOpportunity?.itemIds) {
      entry.missedOpportunity.itemIds.forEach(itemId => {
        const item = getItemById(itemId);
        if (item) {
          allEntries.push({
            itemId,
            title: item.title,
            count: entry.missedOpportunity?.qty?.[itemId] || 1,
            type: 'MISSED_OPPORTUNITY',
            context: item.context,
            note: entry.missedOpportunity?.note,
            intention: entry.missedOpportunity?.intention
          });
        }
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6 text-blue-500" />
          Daily Ledger
        </h2>
        <p className="text-muted-foreground">
          {formatDate(date)}
        </p>
      </div>

      {allEntries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">No entries for today</h3>
                <p className="text-muted-foreground">
                  Start your spiritual journey by adding some deeds to today's reflection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Spiritual Activities</span>
              <Badge variant="secondary">{allEntries.length} entries</Badge>
            </CardTitle>
            <CardDescription>
              A detailed view of your spiritual activities for reflection and growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead className="text-center">Count</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Context</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allEntries.map((entryItem, index) => {
                  const item = getItemById(entryItem.itemId);
                  return (
                    <TableRow key={`${entryItem.itemId}-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item?.emoji}</span>
                          <span className="font-medium">{entryItem.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-bold">
                          {entryItem.count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(entryItem.type)}>
                          {getTypeLabel(entryItem.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entryItem.context && (
                          <span className="text-sm text-muted-foreground capitalize">
                            {entryItem.context.replace('_', ' ')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 max-w-xs">
                          {entryItem.note && (
                            <p className="text-sm">{entryItem.note}</p>
                          )}
                          {entryItem.tawbah && (
                            <Badge variant="outline" className="text-xs">
                              Tawbah made
                            </Badge>
                          )}
                          {entryItem.intention && (
                            <p className="text-xs text-muted-foreground italic">
                              Intention: {entryItem.intention}
                            </p>
                          )}
                          {entryItem.guidance && (
                            <p className="text-xs text-muted-foreground">
                              Guidance: {entryItem.guidance}
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Du'a section */}
      {entry?.dua && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Du'a</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-right font-arabic leading-relaxed bg-muted/30 p-4 rounded">
              {entry.dua}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer reminder */}
      <div className="text-center text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg border">
        <p className="italic">
          "This is a reflective aid for your spiritual journey. 
          Only Allah (SWT) knows the true state of hearts and the weight of deeds."
        </p>
      </div>
    </div>
  );
}
