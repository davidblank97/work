<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output  omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/user_preferences/preference[@tag='enable_tracelog']">
		<preference tag="tracelog_mode" value="0"/>
	</xsl:template>

	<xsl:template match="/user_preferences/preference[@tag='gas_flow_warning_deviation']">
		<preference tag="gas_flow_warning_deviation" value="10"/>
	</xsl:template>

	<xsl:template match="/user_preferences/preference[@tag='no_gas_flow_deviation']">
		<preference tag="no_gas_flow_deviation" value="10"/>
	</xsl:template>

	<xsl:template match="/user_preferences/preference[@tag='ntp_server_name']">
		<xsl:copy-of select="."/>
		<preference tag="shield_gas_symbol" value=""/>
		<preference tag="trail_gas_symbol" value=""/>
		<preference tag="plasma_gas_symbol" value=""/>
		<preference tag="backup_gas_symbol" value=""/>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>