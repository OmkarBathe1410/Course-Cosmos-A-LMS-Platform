import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLayoutData: builder.query({
      query: (type) => ({
        url: `get-layout/${type}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    editLayout: builder.mutation({
      query: ({ type, faq, categories }) => ({
        url: `edit-layout`,
        method: "PUT",
        body: {
          type,
          faq,
          categories,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetLayoutDataQuery, useEditLayoutMutation } = layoutApi;
