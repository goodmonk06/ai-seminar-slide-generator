/**
 * Metrics and Instrumentation
 * Tracks application performance and usage metrics
 */

export interface MetricTags {
  [key: string]: string | number;
}

export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: MetricTags;
  type: "counter" | "gauge" | "histogram";
}

class Metrics {
  private metrics: Metric[] = [];
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  /**
   * Increment a counter
   */
  increment(name: string, value: number = 1, tags?: MetricTags): void {
    const key = this.getKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);

    this.recordMetric({
      name,
      value: current + value,
      timestamp: new Date(),
      tags,
      type: "counter",
    });
  }

  /**
   * Decrement a counter
   */
  decrement(name: string, value: number = 1, tags?: MetricTags): void {
    this.increment(name, -value, tags);
  }

  /**
   * Set a gauge value
   */
  gauge(name: string, value: number, tags?: MetricTags): void {
    const key = this.getKey(name, tags);
    this.gauges.set(key, value);

    this.recordMetric({
      name,
      value,
      timestamp: new Date(),
      tags,
      type: "gauge",
    });
  }

  /**
   * Record a histogram value (for timing, sizes, etc.)
   */
  histogram(name: string, value: number, tags?: MetricTags): void {
    const key = this.getKey(name, tags);
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);

    this.recordMetric({
      name,
      value,
      timestamp: new Date(),
      tags,
      type: "histogram",
    });
  }

  /**
   * Measure execution time of a function
   */
  async timing<T>(
    name: string,
    fn: () => Promise<T> | T,
    tags?: MetricTags
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.histogram(name, duration, tags);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.histogram(name, duration, { ...tags, error: "true" });
      throw error;
    }
  }

  /**
   * Get current counter value
   */
  getCounter(name: string, tags?: MetricTags): number {
    const key = this.getKey(name, tags);
    return this.counters.get(key) || 0;
  }

  /**
   * Get current gauge value
   */
  getGauge(name: string, tags?: MetricTags): number | undefined {
    const key = this.getKey(name, tags);
    return this.gauges.get(key);
  }

  /**
   * Get histogram statistics
   */
  getHistogramStats(name: string, tags?: MetricTags): {
    count: number;
    min: number;
    max: number;
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  } | undefined {
    const key = this.getKey(name, tags);
    const values = this.histograms.get(key);

    if (!values || values.length === 0) {
      return undefined;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      count,
      min: sorted[0],
      max: sorted[count - 1],
      avg: sum / count,
      p50: sorted[Math.floor(count * 0.5)],
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)],
    };
  }

  /**
   * Get all recorded metrics
   */
  getAllMetrics(): Metric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics summary
   */
  getSummary() {
    const counters = Array.from(this.counters.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const gauges = Array.from(this.gauges.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const histograms = Array.from(this.histograms.keys()).map((name) => ({
      name,
      stats: this.getHistogramStats(name),
    }));

    return { counters, gauges, histograms };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }

  private getKey(name: string, tags?: MetricTags): string {
    if (!tags || Object.keys(tags).length === 0) {
      return name;
    }

    const tagStr = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join(",");

    return `${name}{${tagStr}}`;
  }

  private recordMetric(metric: Metric): void {
    this.metrics.push(metric);

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }
}

// Singleton instance
export const metrics = new Metrics();

// Common metric names
export const MetricNames = {
  // API metrics
  API_REQUEST: "api.request",
  API_RESPONSE_TIME: "api.response_time",
  API_ERROR: "api.error",

  // Generation metrics
  PLAN_GENERATED: "plan.generated",
  GENERATION_TIME: "generation.time",
  GENERATION_TOKENS: "generation.tokens",

  // Storage metrics
  STORAGE_READ: "storage.read",
  STORAGE_WRITE: "storage.write",
  STORAGE_DELETE: "storage.delete",

  // Template metrics
  TEMPLATE_USED: "template.used",
  TEMPLATE_CREATED: "template.created",

  // Presentation metrics
  PRESENTATION_CREATED: "presentation.created",
  PRESENTATION_DELIVERED: "presentation.delivered",
};
