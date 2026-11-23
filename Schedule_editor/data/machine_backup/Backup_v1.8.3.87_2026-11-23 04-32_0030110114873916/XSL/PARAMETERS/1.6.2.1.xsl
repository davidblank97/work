<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='264974']/short_name">
		<short_name>OSC</short_name>
	</xsl:template>
	<xsl:template match="/Parameters/param[@id='264982']/short_name">
		<short_name>THETA</short_name>
	</xsl:template>
	<xsl:template match="/Parameters/param[@id='265035']/short_name">
		<short_name>WIRE MANIPULATOR</short_name>
	</xsl:template>
	<xsl:template match="/Parameters/param[@id='265036']/short_name">
		<short_name>TUNGSTEN</short_name>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>