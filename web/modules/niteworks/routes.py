from flask import render_template
import os.path
from emcs_admin_utils import jsplasma
from emcs_admin_utils.flask_components import Component

#use flask because will do a lot of work for us
BASEPATH = os.path.abspath(os.path.dirname(__file__))
STATIC_PATH = os.path.join(BASEPATH, 'public')
TEMPLATES_PATH = os.path.join(BASEPATH, 'templates')
app = Component('mutualvision', __name__, static_folder=STATIC_PATH, template_folder=TEMPLATES_PATH)

@app.route('/mutualvision')
def streetcams_base():
    return render_template('main.html', jsplasma=jsplasma)

@app.route('/mutualvision/arrears')
def arrears_base():
    return render_template('arrears.html', jsplasma=jsplasma)

@app.route('/mutualvision/customers')
def customers_base():
    return render_template('customers.html', jsplasma=jsplasma)

@app.route('/mutualvision/buildsoc')
def buildsoc_base():
    return render_template('buildsoc.html', jsplasma=jsplasma)

@app.route('/mutualvision/dashboard')
def dashboard_base():
    return render_template('dashboard.html', jsplasma=jsplasma)

@app.route('/mutualvision/legend')
def legend_base():
    return render_template('other.html', jsplasma=jsplasma)

@app.route('/mutualvision/loans')
def loans_base():
    return render_template('loans.html', jsplasma=jsplasma)

@app.route('/mutualvision/ratings')
def ratings_base():
    return render_template('ratings.html', jsplasma=jsplasma)

@app.route('/mutualvision/ltv')
def ltv_base():
    return render_template('ltv.html', jsplasma=jsplasma)

@app.route('/mutualvision/vernon')
def vernon_base():
    return render_template('vernon.html', jsplasma=jsplasma)

@app.route('/mutualvision/intro')
def intro_base():
    return render_template('intro.html', jsplasma=jsplasma)