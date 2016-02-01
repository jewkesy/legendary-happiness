from flask import Blueprint, render_template
from emcs_admin_utils import jsplasma

runner = Blueprint('runner', __name__,
                   static_folder = 'static',
                   template_folder = 'templates')

@runner.route('/')
def base():
    return render_template('runner.html', jsplasma=jsplasma)