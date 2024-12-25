import serverClient from "@/lib/server/serverClient";
import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();

  let result;

  try {
    if (query.trim().startsWith("mutation")) {
      // handle mutations
      result = await serverClient.mutate({
        mutation: gql`
          ${query}
        `,
        variables,
      });
    } else {
      // handle queries
      result = await serverClient.query({
        query: gql`
          ${query}
        `,
        variables,
      });
    }

    const data = result.data;
    console.log("Data >>", data);
    return NextResponse.json(
      {
        data,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
