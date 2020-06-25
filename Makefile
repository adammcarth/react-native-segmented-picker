# This Makefile facilitates fake package installation for testing
# purposes.
PKG_PATH:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

define USAGE

make <option> project_root=<folder>

options: 
	install        # build and fake install to a javascript project

endef

export USAGE

project_root ?= ./examples

default:
	@echo "$$USAGE"

build:
	@yarn build

install: build
	@rsync -zrv ${PKG_PATH}/ ${project_root}/node_modules/react-native-segmented-picker \
		--include 'README.md' \
		--include 'LICENSE' \
		--include 'package.json' \
		--include 'yarn.lock' \
		--include 'dist/***' \
		--include 'ios/***' \
		--include 'react-native-config.js' \
		--include 'RNSegmentedPicker.podspec' \
		--exclude '*'
	@cd ${project_root}/node_modules/react-native-segmented-picker && yarn install --production
	@echo "\n\nDone. Package successfully installed to '${project_root}/node_modules'."
