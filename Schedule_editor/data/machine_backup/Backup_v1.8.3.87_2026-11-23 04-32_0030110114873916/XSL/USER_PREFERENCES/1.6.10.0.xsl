<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences/preference[@tag='should_log_osc_position']">
		<preference tag="should_log_osc_position" value="true"/>
	</xsl:template>

	<xsl:template match="/user_preferences/preference[@tag='should_log_acc_position']">
		<preference tag="should_log_acc_position" value="true"/>
	</xsl:template>
	
	<xsl:template match="/user_preferences/preference[@tag='wire_assist_enable_mode']">
		<xsl:copy-of select="."/>
		<preference tag="should_log_rotating_tungsten_position" value="true"/>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>