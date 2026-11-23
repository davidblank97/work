<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->
	
	<xsl:template match="/user_preferences/preference[@tag='enable_datalog_segment_averages']">
		<xsl:copy-of select="."/>
		<preference tag="should_use_jog_speed_as_homing_speed" value="true"/>
		<preference tag="percent_of_max_speed_as_homing_speed" value="100"/>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>