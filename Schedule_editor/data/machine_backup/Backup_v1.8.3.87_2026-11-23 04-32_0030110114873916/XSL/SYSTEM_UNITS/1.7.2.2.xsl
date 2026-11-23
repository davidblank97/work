<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!--  Add your XSL Transformations below this line  -->
	<xsl:template match="/system_user_units/parameters/*[last()]">
		<xsl:copy-of select="."/>
		<parameter id="271629" mode="0" unit="milliseconds"/>
	</xsl:template>
	
	<!--  Do not change the template below -->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>