#!/usr/bin/env bash

source .env

npx vsce publish patch -p $VS_MARKETPLACE_PAT
git push --follow-tags
npx ovsx publish -p $OPEN_VSX_PAT
