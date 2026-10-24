-include .env

BUCKET ?= streamclip-frontend-prod
DIST ?= EU7NU9D5BC3Z
PORT ?= 3000
export AWS_PAGER :=

.PHONY: help dev build start sync invalidate deploy

help:
	@echo "make dev         Next.js dev server on :$(PORT)"
	@echo "make build       static export into out/"
	@echo "make start       serve out/ locally on :$(PORT)"
	@echo "make deploy      build, upload to S3, invalidate CloudFront"
	@echo "make sync        upload out/ to s3://$(BUCKET)"
	@echo "make invalidate  invalidate CloudFront $(DIST)"

dev:
	npm run dev

build:
	npm run build

start:
	npx --yes serve out -s -p $(PORT)

sync:
	aws s3 sync out/ s3://$(BUCKET) \
		--delete \
		--exclude "*.html" \
		--exclude "robots.txt" \
		--exclude "sitemap.xml" \
		--cache-control "public,max-age=31536000,immutable"
	aws s3 cp out/robots.txt s3://$(BUCKET)/robots.txt \
		--cache-control "no-cache,no-store,must-revalidate" \
		--content-type "text/plain"
	aws s3 cp out/sitemap.xml s3://$(BUCKET)/sitemap.xml \
		--cache-control "no-cache,no-store,must-revalidate" \
		--content-type "application/xml"
	@if [ -f out/404.html ]; then \
		aws s3 cp out/404.html s3://$(BUCKET)/404.html \
			--cache-control "no-cache,no-store,must-revalidate" \
			--content-type "text/html"; \
	fi
	@find out -name index.html | xargs -P 8 -I{} sh -c ' \
		rel="$${1#out/}"; \
		dest="$${rel%/index.html}"; \
		if [ "$$rel" = "index.html" ]; then \
			aws s3 cp "$$1" s3://$(BUCKET)/index.html \
				--cache-control "no-cache,no-store,must-revalidate" \
				--content-type "text/html"; \
		else \
			aws s3 cp "$$1" s3://$(BUCKET)/$$rel \
				--cache-control "no-cache,no-store,must-revalidate" \
				--content-type "text/html"; \
			aws s3 cp "$$1" s3://$(BUCKET)/$$dest \
				--cache-control "no-cache,no-store,must-revalidate" \
				--content-type "text/html"; \
			aws s3api put-object --bucket $(BUCKET) --key "$$dest/" --body "$$1" \
				--cache-control "no-cache,no-store,must-revalidate" \
				--content-type "text/html"; \
		fi' _ {}

invalidate:
	aws cloudfront create-invalidation \
		--distribution-id $(DIST) \
		--paths "/index.html" "/" "/*" \
		--no-cli-pager

deploy: build sync invalidate
	@echo "Deployed to s3://$(BUCKET) and invalidated $(DIST)"
