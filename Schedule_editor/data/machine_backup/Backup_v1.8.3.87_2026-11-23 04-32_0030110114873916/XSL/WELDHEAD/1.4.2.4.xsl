<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="head[@model='G-MT2-Theta']/axis[@name='theta']/max_speed">
		<max_speed>15</max_speed>
	</xsl:template>

	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux0']/acceleration">
		<acceleration>0</acceleration>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux0']/pos/loop/i">
		<i>1.000</i>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux0']/pos/loop/d">
		<d>10.000</d>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux0']/pos/loop/deadband">
		<deadband>0.000</deadband>
	</xsl:template>

	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux1']/acceleration">
		<acceleration>0</acceleration>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux1']/pos[@type='1']/@channel">
		<xsl:attribute name="channel">
			<xsl:value-of select="'7'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux1']/pos[@type='1']/loop/p">
		<p>2000.000</p>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux1']/pos[@type='1']/loop/i">
		<i>20.000</i>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux1']/pos[@type='1']/loop/d">
		<d>5.000</d>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='aux1']/pos[@type='1']/loop/vff">
		<vff>80.000</vff>
	</xsl:template>

	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='theta']/max_speed">
		<max_speed>15</max_speed>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='theta']/acceleration">
		<acceleration>0</acceleration>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='theta']/pos/loop/p">
		<p>1000.000</p>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='theta']/pos/loop/i">
		<i>50.000</i>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='theta']/pos/loop/d">
		<d>20.000</d>
	</xsl:template>
	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='theta']/pos/loop/vff">
		<vff>80.000</vff>
	</xsl:template>

	<xsl:template match="head[@model='G-MT2-Theta-Compound']/axis[@name='acc']/acceleration">
		<acceleration>0</acceleration>
	</xsl:template>
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>