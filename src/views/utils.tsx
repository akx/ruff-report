import { ruleMap } from "../data";
import { Link } from "wouter";
import React from "react";
import { HoverCard } from "radix-ui";
import { RuleExplanation } from "../types/ruff";
import Markdown from "markdown-to-jsx";

export function renderCodeLink(code: string) {
  const ruleInfo = ruleMap[code];
  const link = (
    <span>
      <Link to={`/rule/${code}`} className="link">
        {code}
      </Link>
      {ruleInfo?.name ? <small>&nbsp;{ruleInfo.name}</small> : null}
    </span>
  );
  if (ruleInfo?.explanation) {
    return (
      <HoverCard.Root>
        <HoverCard.Trigger>{link}</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className="bg-white shadow-lg rounded max-w-prose max-h-80 flex flex-col">
            <div className="px-4 py-1 text-sm bg-neutral-200 rounded-t">
              {code}
            </div>
            <div className="p-4 prose prose-sm leading-tight overflow-y-auto">
              {renderRuleExplanation(ruleInfo)}
            </div>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    );
  }
  return link;
}

export function renderFileLink(file: string) {
  return (
    <Link to={`/file/${file}`} className="link">
      {file}
    </Link>
  );
}

export function renderRuleExplanation(ruleInfo: RuleExplanation | undefined) {
  if (!ruleInfo?.explanation) {
    return (
      <div className="alert">We don't have an explanation for this rule...</div>
    );
  }
  return (
    <Markdown options={{ wrapper: React.Fragment }}>
      {ruleInfo.explanation}
    </Markdown>
  );
}
