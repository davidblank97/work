<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->
	
	<xsl:template match="/user_preferences/preference[@tag='percent_of_max_speed_as_homing_speed']">
		<xsl:copy-of select="."/>
		<preference tag="should_respond_to_alarms_from_aux_0" value="true"/>
		<preference tag="should_respond_to_alarms_from_aux_1" value="true"/>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>