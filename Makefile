#Most demos have use python code in a virtualenv, created by make
VENVDO=$(PWD)/scripts/venvdo

#Other things that change per demo
WEB_TIME=web/modules/runner/static/runner/js/demo_time.json

all: loan-fluoro 

deps: $(PWD)/venv/bin/activate

$(WEB_TIME): lib/python/mutualVision/demo_time.json
	cp $^ $@

$(PWD)/venv/bin/activate: requirements.txt
	test -d $(PWD)/venv/bin || virtualenv $(PWD)/venv
	$(VENVDO) pip install --upgrade pip
	$(VENVDO) pip install -r $^


loan-fluoro: deps
	$(VENVDO) python -m mutualVision.generate_loan_fluoroscope

neat:
	git checkout $(PWD)/etc/mutualVision/loan.protein
	git checkout $(PWD)/etc/mutualVision/inculcators.protein
	rm -f $(WEB_TIME)
	rm -f $(TOPO_FILES)

clean: neat
	rm -fr $(PWD)/venv

