# The site we will navigate into, handling it's session
br.open('http://my.iium.edu.my/reports/rwservlet?runsisrepnosso&paramform=yes&desformat=xml&config=nosso&report=adv_Class_list_att_baru30_CGPA2.rep')

# page = requests.get('http://onlinebil.lap.com.my:8080/ebilling/login.aspx')
tree = html.fromstring(br.response().read())

# Select the second (index one) form (the first form is a search query box)
br.select_form(nr=0)

br.form['username'] = 'AFIFHUSMAN'
br.form['password'] = 'Kahuna1!2'
br.form['database'] = 'anr'

# Login
br.submit()

br.open('http://my.iium.edu.my/reports/rwservlet?runsisrepnosso&paramform=yes&desformat=xml&config=nosso&report=adv_Class_list_att_baru30_CGPA2.rep')
tree2 = html.fromstring(br.response().read())

br.select_form(nr=0)

br.form['SES'] = '2018/2019'
br.form['SEM'] = '1'
br.form['P_by'] = ['Course']
br.form['CODE'] = 'MCTE 2333'
br.form['ORDER_BY'] = ['Name']