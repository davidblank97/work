<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!--  Add your XSL Transformations below this line  -->
	<xsl:template match="/system_user_units/parameters/parameter[@id='263450']" />
	
	<xsl:template match="/system_user_units/defaults/heat_input[@unit='kilojoules_per_millimeter_0.6']" >
		<heat_input unit="kilojoules_per_millimeter"/>
	</xsl:template>
	
	<!--  Do not change the template below -->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>