import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, normalizeToMonthly } from '../utils/calculations';
import { CATEGORY_COLORS } from '../data/subscriptionsData';
import { Layers } from 'lucide-react';

interface TreemapNodeData {
  name: string;
  category?: string;
  value?: number;
  color?: string;
  iconName?: string;
  percentage?: number;
  children?: TreemapNodeData[];
}

export const D3CategoryTreemap: React.FC = () => {
  const { subscriptions, currency, stats } = useSubscriptions();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<{
    name: string;
    category: string;
    value: number;
    percentage: number;
  } | null>(null);

  const activeSubs = subscriptions.filter(s => s.status === 'active' || s.status === 'trial');

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || activeSubs.length === 0) return;

    const width = containerRef.current.clientWidth || 600;
    const height = Math.max(340, Math.min(460, width * 0.55));

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .style('font-family', 'inherit');

    // Build hierarchy tree: root -> category -> subscription
    const totalSpend = stats.totalMonthlySpend || 1;
    const groupedByCategory: Record<string, typeof activeSubs> = {};

    activeSubs.forEach(sub => {
      if (!groupedByCategory[sub.category]) {
        groupedByCategory[sub.category] = [];
      }
      groupedByCategory[sub.category].push(sub);
    });

    const rootData: TreemapNodeData = {
      name: 'Total Subscriptions',
      children: Object.entries(groupedByCategory).map(([category, items]) => ({
        name: category,
        color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6366F1',
        children: items.map(sub => {
          const monthly = normalizeToMonthly(sub.cost, sub.billingCycle);
          return {
            name: sub.name,
            category: sub.category,
            value: monthly,
            color: sub.color || CATEGORY_COLORS[sub.category as keyof typeof CATEGORY_COLORS] || '#6366F1',
            iconName: sub.iconName,
            percentage: totalSpend > 0 ? (monthly / totalSpend) * 100 : 0,
          };
        }),
      })),
    };

    const root = d3
      .hierarchy<TreemapNodeData>(rootData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = d3
      .treemap<TreemapNodeData>()
      .size([width, height])
      .paddingTop(22)
      .paddingInner(3)
      .paddingOuter(4)
      .round(true);

    treemapLayout(root);

    const rectangularRoot = root as unknown as d3.HierarchyRectangularNode<TreemapNodeData>;

    // Group for category parents
    const categoryNodes = rectangularRoot.children || [];

    // Draw Category Groups & Background headers
    const categoryGroups = svg
      .selectAll('g.category-group')
      .data(categoryNodes)
      .enter()
      .append('g')
      .attr('class', 'category-group');

    categoryGroups
      .append('rect')
      .attr('x', d => (d as d3.HierarchyRectangularNode<TreemapNodeData>).x0)
      .attr('y', d => (d as d3.HierarchyRectangularNode<TreemapNodeData>).y0)
      .attr('width', d => Math.max(0, (d as d3.HierarchyRectangularNode<TreemapNodeData>).x1 - (d as d3.HierarchyRectangularNode<TreemapNodeData>).x0))
      .attr('height', d => Math.max(0, (d as d3.HierarchyRectangularNode<TreemapNodeData>).y1 - (d as d3.HierarchyRectangularNode<TreemapNodeData>).y0))
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('fill', d => d.data.color || '#3B82F6')
      .attr('fill-opacity', 0.08)
      .attr('stroke', d => d.data.color || '#3B82F6')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-width', 1.5);

    categoryGroups
      .append('text')
      .attr('x', d => (d as d3.HierarchyRectangularNode<TreemapNodeData>).x0 + 8)
      .attr('y', d => (d as d3.HierarchyRectangularNode<TreemapNodeData>).y0 + 15)
      .text(d => {
        const catVal = d.value || 0;
        const pct = totalSpend > 0 ? Math.round((catVal / totalSpend) * 100) : 0;
        const label = `${d.data.name} (${pct}%)`;
        const boxWidth = (d as d3.HierarchyRectangularNode<TreemapNodeData>).x1 - (d as d3.HierarchyRectangularNode<TreemapNodeData>).x0;
        return boxWidth > 70 ? label : '';
      })
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('fill', d => d.data.color || '#3B82F6');

    // Draw Leaf Subscriptions
    const leaves = rectangularRoot.leaves() as d3.HierarchyRectangularNode<TreemapNodeData>[];

    const leafGroups = svg
      .selectAll('g.leaf-node')
      .data(leaves)
      .enter()
      .append('g')
      .attr('class', 'leaf-node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (_event, d) => {
        const val = d.data.value || 0;
        setHoveredNode({
          name: d.data.name,
          category: d.data.category || '',
          value: val,
          percentage: totalSpend > 0 ? Math.round((val / totalSpend) * 1000) / 10 : 0,
        });
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
      });

    leafGroups
      .append('rect')
      .attr('width', d => Math.max(0, d.x1 - d.x0))
      .attr('height', d => Math.max(0, d.y1 - d.y0))
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('fill', d => d.data.color || '#3B82F6')
      .attr('fill-opacity', 0.85)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .transition()
      .duration(400)
      .attr('fill-opacity', 0.95);

    // Text labels inside leaf blocks
    leafGroups
      .append('text')
      .attr('x', 6)
      .attr('y', 16)
      .text(d => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 45 || h < 26) return '';
        const name = d.data.name;
        return w < 80 && name.length > 8 ? name.substring(0, 7) + '…' : name;
      })
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#ffffff');

    leafGroups
      .append('text')
      .attr('x', 6)
      .attr('y', 30)
      .text(d => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 55 || h < 42) return '';
        const pct = d.data.percentage ? `${Math.round(d.data.percentage)}%` : '';
        return `${formatCurrency(d.data.value || 0, currency)} (${pct})`;
      })
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('fill', 'rgba(255, 255, 255, 0.88)');

  }, [activeSubs, stats.totalMonthlySpend, currency]);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg">
              D3 Category & Service Treemap Breakdown
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Proportional area representation of monthly spend across all active subscriptions
            </p>
          </div>
        </div>

        {/* Live Hover Tooltip Card */}
        {hoveredNode && (
          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-md flex items-center gap-2">
            <span className="text-blue-400 dark:text-blue-600 font-bold">{hoveredNode.name}</span>
            <span className="opacity-60">•</span>
            <span>{formatCurrency(hoveredNode.value, currency)}/mo</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 dark:text-blue-700 text-[10px] font-bold">
              {hoveredNode.percentage}% of total
            </span>
          </div>
        )}
      </div>

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden rounded-2xl bg-neutral-50/50 dark:bg-neutral-800/20 border border-neutral-100 dark:border-neutral-800/60 flex items-center justify-center min-h-[340px]"
      >
        {activeSubs.length === 0 ? (
          <div className="text-center py-12 text-xs text-neutral-400">
            No active subscriptions to render treemap.
          </div>
        ) : (
          <svg ref={svgRef} className="w-full" />
        )}
      </div>

      {/* Category Contribution Legend Pills */}
      <div className="pt-2">
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
          Category Contribution Distribution
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {stats.categoryTotals.map(cat => (
            <div
              key={cat.category}
              className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  {cat.category}
                </span>
              </div>
              <div className="font-bold text-neutral-900 dark:text-white shrink-0 ml-2">
                {cat.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
