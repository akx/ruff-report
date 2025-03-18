import { ruleMap } from "../data";
import { Link } from "wouter";
import React from "react";
import { Alert, HoverCard, Text } from "@mantine/core";
import { RuleExplanation } from "../types/ruff";
import ReactMarkdown from "react-markdown";

export function renderCodeLink(code: string) {
  const ruleInfo = ruleMap[code];
  const link = (
    <span>
      <Link to={`/rule/${code}`}>{code}</Link>
      {ruleInfo?.name ? <small>&nbsp;{ruleInfo.name}</small> : null}
    </span>
  );
  if (ruleInfo?.explanation) {
    return (
      <HoverCard width={400} shadow="md" openDelay={500}>
        <HoverCard.Target>{link}</HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">{renderRuleExplanation(ruleInfo)}</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  }
  return link;
}

export function renderFileLink(file: string) {
  return (
    <>
      <Link to={`/file/${file}`}>{file}</Link>
    </>
  );
}

export function renderRuleExplanation(ruleInfo: RuleExplanation | undefined) {
  if (!ruleInfo?.explanation) {
    return <Alert>We don't have an explanation for this rule...</Alert>;
  }
  return <ReactMarkdown>{ruleInfo.explanation}</ReactMarkdown>;
}
