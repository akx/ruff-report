import React from "react";

export function NoDataAlert() {
  return (
    <div className="p-4">
      <div className="alert">
        <div className="text-lg">No data!</div>
        There's no data to show. <br />
        Make sure your filters aren't hiding it..?
      </div>
    </div>
  );
}
