"use client";

export default function ErrorPage({ error, reset }) {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>{JSON.stringify(error.message, null, 2)}</p>
    </div>
  );
}
