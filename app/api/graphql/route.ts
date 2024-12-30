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
  console.log("Query >>", query);
  console.log("Variables >>", variables);

  try {
    let result;
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

    console.log("Result >>", result);
    return NextResponse.json(
      {
        data: result.data,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}
