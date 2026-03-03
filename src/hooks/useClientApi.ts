import { API_STORAGE_PREFIX, TTLs } from "@/constants";
import { useGlobal } from "@/contexts";
import type { Database, Tables } from "@/types";
import { useCallback, useEffect, useState } from "react";

export type TableName = keyof Database["public"]["Tables"];

export interface FilterConfig {
  column: string;
  operator: "eq" | "gt" | "lt" | "ilike" | "neq";
  value: any;
}

export type Relation =
  | {
      table: TableName;
      replaceKey?: string;
      relations?: Relation[];
      removeKeys?: string[];
    }
  | TableName;

export interface UseApiGetType<T extends TableName> {
  table: T;
  filters?: FilterConfig[];
  order?: {
    column: keyof Tables<T>;
    ascending?: boolean;
  };
  relations?: Relation[];
  options?: {
    initRun?: boolean;
    cache?: {
      key: string;
      ttl?: number;
      type?: "session" | "local";
    };
  };
}

export interface UseApiGetReturnType<R = any> {
  data: R;
  loading: boolean;
  error: string | null;
  fetch: () => void;
}

export function getEmptyUseApiGetReturnType(): UseApiGetReturnType {
  return {
    data: null,
    loading: false,
    error: null,
    fetch: () => {},
  };
}

export function useApiGet<T extends TableName, R = any>({
  table,
  filters,
  order,
  options,
  relations,
}: UseApiGetType<T>): UseApiGetReturnType<R | null> {
  const { initRun, cache } = options || {};

  const { clientApi } = useGlobal();
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    const cacheKey = API_STORAGE_PREFIX + cache?.key;

    if (cache?.key) {
      const storage = cache.type === "session" ? sessionStorage : localStorage;

      const cachedData = storage.getItem(cacheKey);

      if (cachedData) {
        const data = JSON.parse(cachedData);
        const timestamp = data.timestamp;

        if (timestamp > Date.now() - (cache.ttl || TTLs.sm)) {
          setData(replaceRelationKeys(data.data, relations));
          return;
        }
      }
    }

    if (clientApi) {
      setLoading(true);

      const selectString = ["*", buildSelect(relations)]
        .filter(Boolean)
        .join(",");

      let query = clientApi.from(table).select(selectString);

      if (filters && filters.length > 0) {
        filters.forEach((f) => {
          query = (query as any)[f.operator](f.column, f.value);
        });
      }

      if (order) {
        query = query.order(order.column as any, {
          ascending: order.ascending,
        });
      }

      query.then(({ data: response, error }) => {
        setLoading(false);
        if (error) {
          setError(error.message);
        } else {
          if (cache?.key) {
            const storage =
              cache.type === "session" ? sessionStorage : localStorage;

            storage.setItem(
              cacheKey,
              JSON.stringify({
                timestamp: Date.now(),
                data: response,
              })
            );
          }
          setData(replaceRelationKeys(response, relations) as R);
        }
      });
    }
  }, [clientApi, table, JSON.stringify(filters)]);

  useEffect(() => {
    if (initRun === undefined || initRun) {
      fetch();
    }
  }, [clientApi]);

  return { data, loading, error, fetch };
}

function buildSelect(relations?: Relation[]): string {
  if (!relations || relations.length === 0) return "";

  return relations
    .map((r) => {
      if (typeof r === "string") return `${r}(*)`;
      return `${r.table}(*${r.relations && r.relations.length ? "," : ""}${buildSelect(r.relations)})`;
    })
    .join(",");
}

function replaceRelationKeys(data: any, relations?: Relation[]): any {
  let result: any = [];

  function parse(object: any, relations?: Relation[]): any {
    if (!relations || relations.length === 0) return object;

    return relations.reduce((acc, relation) => {
      if (typeof relation === "string") {
        return {
          ...acc,
          [relation]: object[relation],
        };
      }

      const result = {
        ...acc,
        [relation.replaceKey || relation.table]: parse(
          object[relation.table],
          relation.relations
        ),
      };

      if (relation.replaceKey) {
        delete result[relation.table];
      }

      if (relation.removeKeys) {
        relation.removeKeys.forEach((key) => {
          delete result[relation.replaceKey || relation.table][key];
        });
      }

      return result;
    }, object);
  }

  data.forEach((item: any) => {
    result.push(parse(item, relations));
  });

  return result;
}
