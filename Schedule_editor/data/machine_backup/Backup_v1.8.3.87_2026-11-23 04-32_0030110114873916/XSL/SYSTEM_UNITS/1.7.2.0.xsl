<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!--  Add your XSL Transformations below this line  -->
	<xsl:template match="/system_user_units/groups/rotating_tungsten_distance_telemetry" >
		<xsl:copy-of select="."/>
		<motor_current unit=""/>
		<motor_peak_current_time unit="milliseconds"/>
	</xsl:template>
	
	<!--  Do not change the template below -->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>